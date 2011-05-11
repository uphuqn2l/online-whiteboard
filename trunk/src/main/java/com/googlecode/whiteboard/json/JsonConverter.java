/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.json;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.googlecode.whiteboard.model.AbstractElement;
import com.googlecode.whiteboard.model.enums.ElementType;

public class JsonConverter
{
    private static final JsonConverter INSTANCE = new JsonConverter();
    private Gson gson;

    private JsonConverter() {
        GsonBuilder gsonBilder = new GsonBuilder();
        gsonBilder.registerTypeAdapter(ElementType.class, new ElementTypeAdapter());
        gsonBilder.registerTypeAdapter(AbstractElement.class, new AbstractElementDeserializer());
        gsonBilder.serializeNulls();
        gson = gsonBilder.create();
    }

    /**
     * Returns singleton instance.
     *
     * @return JsonConverter
     */
    public static JsonConverter getInstance() {
        return INSTANCE;
    }

    public Gson getGson() {
        return gson;
    }
}
