/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.utils;

import com.google.gson.Gson;
import com.googlecode.whiteboard.json.JsonConverter;
import com.googlecode.whiteboard.model.Whiteboard;

public class TestJson
{
    public static void main(String[] args) throws Exception {
        Whiteboard wb = new Whiteboard();
        wb.addUser("Oleg");
        String json = WhiteboardUtils.convertToJson(wb);
        Gson gson = JsonConverter.getGson();
        Whiteboard wbClone = gson.fromJson(json, Whiteboard.class);


        System.out.println(json);
    }
}
