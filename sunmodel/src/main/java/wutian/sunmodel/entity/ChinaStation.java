package wutian.sunmodel.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChinaStation {
    private String province;
    private String stationId;
    private String name;
    private String type;
    private List<Double> coordinates;
}
