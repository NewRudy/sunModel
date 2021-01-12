package wutian.sunmodel.entity;

import lombok.Data;

import java.util.List;

@Data
public class MultiPolygon {

    String type;

    List<List<List<List<Double>>>> coordinates;
}
