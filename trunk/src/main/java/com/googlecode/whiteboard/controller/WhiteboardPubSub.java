/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.controller;

import org.atmosphere.annotation.Broadcast;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.jersey.Broadcastable;
import org.atmosphere.jersey.SuspendResponse;

import javax.ws.rs.*;

@Path("/pubsub/{topic}")
@Produces("text/html;charset=ISO-8859-1")
public class WhiteboardPubSub
{
    private
    @PathParam("topic")
    Broadcaster topic;

    @GET
    public SuspendResponse<String> subscribe() {
        return new SuspendResponse.SuspendResponseBuilder<String>().broadcaster(topic).outputComments(true).build();
    }

    @POST
    @Broadcast
    public Broadcastable publish(@FormParam("message") String message) {
        System.out.println(message);

        return new Broadcastable(message, "", topic);
    }
}
