/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.utils;

import org.apache.commons.lang.StringUtils;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;

public class MessageUtils
{
    public static void addFacesMessage(final FacesContext facesContext, final UIComponent component, final FacesMessage.Severity severity, final String msg) {
        String clientId = null;
        if (component != null) {
            clientId = component.getClientId(facesContext);
        }

        facesContext.addMessage(clientId, new FacesMessage(severity, msg, StringUtils.EMPTY));
    }

    public static void addFacesMessage(final FacesContext facesContext, final UIComponent component, final FacesMessage.Severity severity, final String msg, final String detail) {
        String clientId = null;
        if (component != null) {
            clientId = component.getClientId(facesContext);
        }

        facesContext.addMessage(clientId, new FacesMessage(severity, msg, detail));
    }
}
