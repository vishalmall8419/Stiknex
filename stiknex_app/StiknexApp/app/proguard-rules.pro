# Stiknex Android ProGuard & R8 Configuration

# Preserve JavaScript interface methods for WebView communication
-keepattributes JavascriptInterface
-keepattributes *Annotation*

-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepclassmembers class com.stiknex.app.MainActivity$WebAppInterface {
    public *;
}

# Preserve line number information for debugging stack traces
-keepattributes SourceFile,LineNumberTable