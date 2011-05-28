/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.json;

public interface JsonProvider
{
    public Object fromJson(String json);

    public String toJson(Object object);
}
