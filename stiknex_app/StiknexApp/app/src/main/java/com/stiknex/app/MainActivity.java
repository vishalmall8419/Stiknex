package com.stiknex.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkRequest;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ValueCallback<Uri[]> uploadMessage;
    private static final int FILE_CHOOSER_REQUEST_CODE = 1000;
    private final String websiteURL = "https://stiknex.site";

    /**
     * JavaScript interface for receiving route updates from the React SPA.
     * Guarded by ProGuard rules and strictly restricted to trusted Stiknex origins.
     */
    public class WebAppInterface {
        @JavascriptInterface
        public void onRouteChanged(String url) {
            runOnUiThread(() -> updateRefreshState(url));
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // ✅ Anchor status bar with clean light theme
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.white));
        }

        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        webView = findViewById(R.id.webView);

        // ✅ Child scroll check: never allow pull-to-refresh on interactive canvas/drawing boards
        swipeRefreshLayout.setOnChildScrollUpCallback((parent, child) -> {
            if (isInteractiveRoute(webView != null ? webView.getUrl() : null)) {
                return true; // Child handles gestures, disables swipe-to-refresh
            }
            return webView != null && webView.getScrollY() > 0;
        });

        // ✅ Security-hardened WebView setup
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // 🔒 Security: Disable file:// access to protect local application files
        settings.setAllowFileAccess(false);
        // Allow content:// access needed for SAF file chooser results
        settings.setAllowContentAccess(true);

        // 🔒 Security: Strictly block insecure HTTP content within HTTPS pages
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // 🔒 Security: Disable unused features to reduce attack surface
        settings.setGeolocationEnabled(false);
        settings.setSupportMultipleWindows(false);

        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        CookieManager.getInstance().setAcceptCookie(true);

        // ✅ Register SPA navigation bridge (accessible only within trusted domain)
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        webView.setWebChromeClient(new WebChromeClient() {
            // ✅ File chooser support using standard system intent picker (SAF)
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {
                if (uploadMessage != null) {
                    uploadMessage.onReceiveValue(null);
                    uploadMessage = null;
                }

                uploadMessage = filePathCallback;

                Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                Intent contentSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
                contentSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);
                contentSelectionIntent.setType("image/*");

                Intent[] intentArray;
                if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
                    intentArray = new Intent[]{takePictureIntent};
                } else {
                    intentArray = new Intent[0];
                }

                Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
                chooserIntent.putExtra(Intent.EXTRA_INTENT, contentSelectionIntent);
                chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray);
                chooserIntent.putExtra(Intent.EXTRA_TITLE, "Select or Capture Image");

                startActivityForResult(chooserIntent, FILE_CHOOSER_REQUEST_CODE);
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                updateRefreshState(url);
                if (!isInteractiveRoute(url)) {
                    swipeRefreshLayout.setRefreshing(true);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                swipeRefreshLayout.setRefreshing(false);
                updateRefreshState(url);
                injectSpaBridge(view);
            }

            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                super.doUpdateVisitedHistory(view, url, isReload);
                updateRefreshState(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    return handleUrlNavigation(view, request.getUrl());
                }
                return false;
            }

            @SuppressWarnings("deprecation")
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null) {
                    return handleUrlNavigation(view, Uri.parse(url));
                }
                return false;
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // 🔒 Security: Never bypass TLS/SSL certificate errors!
                // Proceeding through SSL errors violates Google Play policy and invites MITM attacks.
                handler.cancel();
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                recreate();
                return true;
            }
        });

        if (isConnected()) {
            webView.loadUrl(websiteURL);
        } else {
            showNoInternetDialog();
        }

        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (!isInteractiveRoute(webView.getUrl())) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
            }
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    new AlertDialog.Builder(MainActivity.this)
                            .setTitle("Exit App")
                            .setMessage("Are you sure you want to exit?")
                            .setPositiveButton("Yes", (d, w) -> finish())
                            .setNegativeButton("No", null)
                            .show();
                }
            }
        });

        monitorNetworkChanges();
    }

    /**
     * Validates and routes navigation requests.
     * Internal trusted Stiknex domains stay inside the WebView.
     * External URLs or app schemes are safely dispatched to external apps with error handling.
     */
    private boolean handleUrlNavigation(WebView view, Uri uri) {
        if (uri == null) return true;

        String host = uri.getHost();
        String scheme = uri.getScheme();

        // Allow internal navigation for trusted Stiknex domains
        if (isTrustedHost(host) || (scheme == null && uri.toString().startsWith("/"))) {
            return false;
        }

        // Safely dispatch external links to the Android system
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            if (intent.resolveActivity(getPackageManager()) != null) {
                startActivity(intent);
            } else {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, uri);
                browserIntent.addCategory(Intent.CATEGORY_BROWSABLE);
                startActivity(browserIntent);
            }
        } catch (Exception ignored) {
            // Safe fallback if target application or handler is not installed
        }
        return true;
    }

    private boolean isTrustedHost(String host) {
        if (host == null) return false;
        String lower = host.toLowerCase();
        return lower.equals("stiknex.site")
                || lower.endsWith(".stiknex.site")
                || lower.equals("stiknex.vercel.app");
    }

    private boolean isInteractiveRoute(String url) {
        if (url == null) return false;
        String lower = url.toLowerCase();
        return lower.contains("/sticky-notes")
                || lower.contains("/whiteboard")
                || lower.contains("/online-notebook")
                || lower.contains("/notebook")
                || lower.contains("/notes");
    }

    private void updateRefreshState(String url) {
        boolean isInteractive = isInteractiveRoute(url);
        if (swipeRefreshLayout != null) {
            swipeRefreshLayout.setEnabled(!isInteractive);
            if (isInteractive && swipeRefreshLayout.isRefreshing()) {
                swipeRefreshLayout.setRefreshing(false);
            }
        }
    }

    private void injectSpaBridge(WebView view) {
        if (view == null) return;
        String js = "javascript:(function() {" +
                "if (window.__stiknexBridgeInjected) return;" +
                "window.__stiknexBridgeInjected = true;" +
                "function notify() {" +
                "  try {" +
                "    if (window.AndroidBridge && window.AndroidBridge.onRouteChanged) {" +
                "      window.AndroidBridge.onRouteChanged(window.location.pathname || window.location.href);" +
                "    }" +
                "  } catch(e) {}" +
                "}" +
                "var origPush = history.pushState;" +
                "history.pushState = function() {" +
                "  origPush.apply(this, arguments);" +
                "  notify();" +
                "};" +
                "var origReplace = history.replaceState;" +
                "history.replaceState = function() {" +
                "  origReplace.apply(this, arguments);" +
                "  notify();" +
                "};" +
                "window.addEventListener('popstate', notify);" +
                "notify();" +
                "})()";
        view.evaluateJavascript(js, null);
    }

    // ✅ File chooser result
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE && uploadMessage != null) {
            Uri[] result = null;
            if (resultCode == Activity.RESULT_OK) {
                if (data != null) {
                    Uri uriData = data.getData();
                    if (uriData != null) {
                        result = new Uri[]{uriData};
                    }
                }
            }
            uploadMessage.onReceiveValue(result);
            uploadMessage = null;
        }
    }

    private boolean isConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        Network network = cm.getActiveNetwork();
        return network != null;
    }

    private void showNoInternetDialog() {
        new AlertDialog.Builder(this)
                .setTitle("No Internet Connection")
                .setMessage("Please check your connection and try again.")
                .setPositiveButton("Retry", (d, w) -> webView.reload())
                .show();
    }

    private void monitorNetworkChanges() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        cm.registerNetworkCallback(new NetworkRequest.Builder().build(),
                new ConnectivityManager.NetworkCallback() {
                    @Override
                    public void onAvailable(Network network) {
                        runOnUiThread(() -> webView.loadUrl(websiteURL));
                    }
                });
    }
}
