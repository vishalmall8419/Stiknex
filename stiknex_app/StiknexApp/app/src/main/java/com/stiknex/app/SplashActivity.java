package com.stiknex.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.splash_screen);

        ImageView logo = findViewById(R.id.stiknex_logo);
        TextView tagline = findViewById(R.id.tagline);

        // Logo animation
        logo.animate()
                .scaleX(1.2f)
                .scaleY(1.2f)
                .translationY(-180)
                .setDuration(1000)
                .start();

        // Tagline fade-in after delay
        tagline.animate()
                .alpha(1f)
                .setStartDelay(1800)
                .setDuration(500)
                .start();

        // Move to main activity after 4s
        new Handler().postDelayed(() -> {
            startActivity(new Intent(SplashActivity.this, MainActivity.class));
            finish();
        }, 4000);
    }
}

