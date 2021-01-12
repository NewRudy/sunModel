package wutian.sunmodel.entity;

import lombok.Data;

@Data
public class PointGeoJson {
    private String _id;
    private String type;
    private Object properties;
    private SingleJson geometry;
}
