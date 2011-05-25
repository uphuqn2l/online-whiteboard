/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import com.googlecode.whiteboard.model.Whiteboard;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;

import java.util.HashMap;
import java.util.Map;

public class WhiteboardsManager
{
    private Map<String, Whiteboard> whiteboards = new HashMap<String, Whiteboard>();
    private int expiredTime;

    public WhiteboardsManager() throws ConfigurationException {
        Configuration config = new PropertiesConfiguration("wb-configuration.properties");
        expiredTime = config.getInt("whiteboard.expiredTime", 30);
    }

    public void addWhiteboard(Whiteboard whiteboard) {
        whiteboards.put(whiteboard.getUuid(), whiteboard);
    }

    public void updateWhiteboard(Whiteboard whiteboard) {
        whiteboards.put(whiteboard.getUuid(), whiteboard);
    }

    public Whiteboard getWhiteboard(String uuid) {
        return whiteboards.get(uuid);
    }
}
