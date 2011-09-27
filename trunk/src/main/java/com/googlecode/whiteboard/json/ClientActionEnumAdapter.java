/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.json;

import com.google.gson.*;
import com.googlecode.whiteboard.model.transfer.ClientAction;

import java.lang.reflect.Type;

/**
 * Adapter class to convert {@link ClientAction} to JSON and back to Java enum.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public class ClientActionEnumAdapter implements JsonSerializer<ClientAction>, JsonDeserializer<ClientAction>
{
    @Override
    public JsonElement serialize(ClientAction src, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(src.getAction());
    }

    @Override
    public ClientAction deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        return ClientAction.getEnum(json.getAsString());
    }
}
