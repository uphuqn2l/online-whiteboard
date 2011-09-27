/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model;

import java.io.Serializable;

/**
 * Class keeping sender id and user name.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public class UserData implements Serializable
{
    private static final long serialVersionUID = 20110506L;

    private String senderId;
    private String userName;

    public UserData(String senderId, String userName) {
        this.senderId = senderId;
        this.userName = userName.replace("'", "\\\'");
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
