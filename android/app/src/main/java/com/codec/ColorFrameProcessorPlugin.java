package com.codec;


import androidx.camera.core.ImageProxy;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Bitmap;
import android.media.Image;
import android.util.Base64;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

public class ColorFrameProcessorPlugin extends FrameProcessorPlugin {
    Activity context;
    String result, encodeImageString;
    private static final String url="https://codecapp.pythonanywhere.com/predict";


    private void encodeBitmapImage(Bitmap bitmap)
    {
        ByteArrayOutputStream byteArrayOutputStream=new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG,100,byteArrayOutputStream);
        byte[] bytesofimage=byteArrayOutputStream.toByteArray();
        encodeImageString=android.util.Base64.encodeToString(bytesofimage, Base64.DEFAULT);
    }

    private void imageToURL() {
        // hit the API -> Volley
        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {

                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            String data = jsonObject.getString("color");
                            if(data.equals("blue")){
                                result = "Biru";
                            }else{
                                result = "I am curious";
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d("ERROR", error.getMessage());
                    }
                }){

            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String,String>();
                params.put("upload",encodeImageString);
                return params;
            }

        };
        RequestQueue queue = Volley.newRequestQueue(context.getApplicationContext());
        queue.add(stringRequest);

    }

    @Override
    public Object callback(ImageProxy imageProxy, Object[] params) {
        // code goes here
        @SuppressLint("UnsafeOptInUsageError") Image image = imageProxy.getImage();
        if (image == null) {
            // Image Proxy is empty!
            return null;
        }

        Bitmap bitmap = Bitmap.createBitmap(image.getWidth(), image.getHeight(), Bitmap.Config.ARGB_8888);
        encodeBitmapImage(bitmap);
        imageToURL();

        return result;
    }

    ColorFrameProcessorPlugin() {
        super("detectColor");
    }
}