/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.json;

import com.google.gson.*;
import com.googlecode.whiteboard.model.enums.ElementType;

import java.lang.reflect.Type;

public class ElementTypeAdapter implements JsonSerializer<ElementType>, JsonDeserializer<ElementType>
{
    public JsonElement serialize(ElementType src, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(src.getType());
    }

    public ElementType deserialize(JsonElement json, Type classOfT, JsonDeserializationContext context) throws JsonParseException {
        return ElementType.getEnum(json.getAsString());
    }
}

