package wutian.sunmodel.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChinaSSD1017 {
    private String code;
    private List<Double> coordinates;
    private String elevation;
    private String date;
    private Object data;
}
