/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.errorhandler;

import javax.faces.context.ExceptionHandler;
import javax.faces.context.ExceptionHandlerFactory;

/**
 * Factory class to create JSF exception handler {@link DefaultExceptionHandler}.
 *
 * @author ova / last modified by $Author$
 * @version $Revision$
 */
public class DefaultExceptionHandlerFactory extends ExceptionHandlerFactory
{
    private ExceptionHandlerFactory parent;

    public DefaultExceptionHandlerFactory(ExceptionHandlerFactory parent) {
        this.parent = parent;
    }

    /**
     * Creates {@link DefaultExceptionHandler}.
     *
     * @return ExceptionHandler
     */
    public ExceptionHandler getExceptionHandler() {
        ExceptionHandler eh = parent.getExceptionHandler();
        eh = new DefaultExceptionHandler(eh);

        return eh;
    }
}
