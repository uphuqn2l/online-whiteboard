/*
* @author  Oleg Varaksin (ovaraksin@googlemail.com)
* $$Id$$
*/

package com.googlecode.whiteboard.model.base;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

public abstract class AbstractElement
{
    private String uuid;
    private boolean movedToFront;
    private boolean movedToBack;
    private int rotationDegree;

    public AbstractElement updateFromJson(String jsonString) {
        // TODO

        return null;
    }

    public String convertToJson() {
        // TODO

        return null;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getUuid() {
        return uuid;
    }

    public boolean isMovedToFront() {
        return movedToFront;
    }

    public void setMovedToFront(boolean movedToFront) {
        this.movedToFront = movedToFront;
    }

    public boolean isMovedToBack() {
        return movedToBack;
    }

    public void setMovedToBack(boolean movedToBack) {
        this.movedToBack = movedToBack;
    }

    public int getRotationDegree() {
        return rotationDegree;
    }

    public void setRotationDegree(int rotationDegree) {
        this.rotationDegree = rotationDegree;
    }

    public boolean equals(Object obj) {
        //return EqualsBuilder.reflectionEquals(this, obj);

        if (obj == null) {
            return false;
        }

        if (obj == this) {
            return true;
        }

        if (obj.getClass() != getClass()) {
            return false;
        }

        return this.uuid.equals(((AbstractElement) obj).getUuid());
    }

    public int hashCode() {
        //return HashCodeBuilder.reflectionHashCode(this);

        return new HashCodeBuilder(17, 37).append(uuid).toHashCode();
    }

    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}
