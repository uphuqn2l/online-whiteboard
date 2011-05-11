/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import com.googlecode.whiteboard.model.enums.ElementType;

import java.io.Serializable;

public class StraightLine extends Line implements Serializable
{
    public StraightLine(String uuid) {
        super(uuid, ElementType.StraightLine.getType());
    }
}
