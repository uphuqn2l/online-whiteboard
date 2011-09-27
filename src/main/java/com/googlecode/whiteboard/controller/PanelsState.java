/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import javax.faces.event.ActionEvent;

/**
 * Managed bean keeping panels "pin" / "unpin" states.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public class PanelsState
{
    private boolean pinned = true;

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public void tooglePinUnpin(ActionEvent e) {
        this.pinned = !pinned;
    }
}
