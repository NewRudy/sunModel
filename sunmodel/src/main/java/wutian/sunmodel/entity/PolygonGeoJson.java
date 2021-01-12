package wutian.sunmodel.entity;

import lombok.Data;

@Data
public class PolygonGeoJson {
    private String _id;
    private String name;
    private String type;
    private Object properties;
    private Object box;
    private SingleJson geometry;
}
