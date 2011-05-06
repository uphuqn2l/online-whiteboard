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

    public void addWhiteboard(Whiteboard data) {
        whiteboards.put(data.getUuid(), data);
    }

    public void updateWhiteboard(Whiteboard data) {
        whiteboards.put(data.getUuid(), data);
    }

    public Whiteboard getWhiteboard(String uuid) {
        return whiteboards.get(uuid);
    }
}
