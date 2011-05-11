/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.json;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.googlecode.whiteboard.model.AbstractElement;

import java.lang.reflect.Type;

public class AbstractElementDeserializer implements JsonDeserializer<AbstractElement>
{
    @Override
    public AbstractElement deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
