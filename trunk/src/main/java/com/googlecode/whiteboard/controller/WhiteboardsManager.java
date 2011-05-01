/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.model.Whiteboard;

import java.util.HashMap;
import java.util.Map;

public class WhiteboardsManager
{
    private Map<String, Whiteboard> whiteboards = new HashMap<String, Whiteboard>();

    public void addWhiteboard(String uuid, Whiteboard data) {
        whiteboards.put(uuid, data);
    }

    public Whiteboard getWhiteboard(String uuid) {
        return whiteboards.get(uuid);
    }
}
