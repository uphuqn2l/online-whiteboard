/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.base.Picture;

import java.io.Serializable;

public class Icon extends Picture implements Serializable
{
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
