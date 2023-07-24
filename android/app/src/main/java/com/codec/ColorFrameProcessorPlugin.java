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
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.media.Image;
import android.util.Base64;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

public class ColorFrameProcessorPlugin extends FrameProcessorPlugin {
    String result, encodeImageString;
    private static final String url="https://codecapp.pythonanywhere.com/predict-imagestring";
    private Context context;

    private void encodeBitmapImage(Bitmap bitmap)
    {
        ByteArrayOutputStream byteArrayOutputStream=new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG,100,byteArrayOutputStream);
        byte[] bytesofimage=byteArrayOutputStream.toByteArray();
        encodeImageString=android.util.Base64.encodeToString(bytesofimage, Base64.DEFAULT);
    }

    private Bitmap toBitmap(Image image) {
        Image.Plane[] planes = image.getPlanes();
        ByteBuffer yBuffer = planes[0].getBuffer();
        ByteBuffer uBuffer = planes[1].getBuffer();
        ByteBuffer vBuffer = planes[2].getBuffer();

        int ySize = yBuffer.remaining();
        int uSize = uBuffer.remaining();
        int vSize = vBuffer.remaining();

        byte[] nv21 = new byte[ySize + uSize + vSize];
        //U and V are swapped
        yBuffer.get(nv21, 0, ySize);
        vBuffer.get(nv21, ySize, vSize);
        uBuffer.get(nv21, ySize + vSize, uSize);

        YuvImage yuvImage = new YuvImage(nv21, ImageFormat.NV21, image.getWidth(), image.getHeight(), null);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        yuvImage.compressToJpeg(new Rect(0, 0, yuvImage.getWidth(), yuvImage.getHeight()), 75, out);

        byte[] imageBytes = out.toByteArray();
        return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
    }

    private void imageToURL() {
        try {
            // hit the API -> Volley
            StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {

                            try {
                                JSONObject jsonObject = new JSONObject(response);
                                String data = jsonObject.getString("color");
                                result = data;
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
                    }) {

                @Override
                protected Map<String, String> getParams() {
                    Map<String, String> params = new HashMap<String, String>();
                    params.put("imagestring", encodeImageString);
                    return params;
                }
            };

             RequestQueue queue = Volley.newRequestQueue(context);
             queue.add(stringRequest);

        }catch(Exception e){
            StringWriter errors = new StringWriter();
            e.printStackTrace(new PrintWriter(errors));
        }

    }

    @Override
    public Object callback(ImageProxy imageProxy, Object[] params) {
         //code goes here
         @SuppressLint("UnsafeOptInUsageError") Image image = imageProxy.getImage();
         if (image == null) {
             // Image Proxy is empty!
             return null;
         }

//         Bitmap bitmap = Bitmap.createBitmap(image.getWidth(), image.getHeight(), Bitmap.Config.ARGB_8888);
        Bitmap bitmap =toBitmap(image);
        int xaxis = (int) (0.47 * image.getWidth());
        int yaxis = (int) (0.55 * image.getHeight());
        bitmap = Bitmap.createBitmap(bitmap, xaxis, yaxis, 20, 20);
        bitmap = Bitmap.createScaledBitmap(bitmap, 500, 500, false);
        encodeBitmapImage(bitmap);
        imageToURL();

        return result;
    }

    ColorFrameProcessorPlugin(Context ctx) {
        super("detectColor");
        context=ctx;
    }
}