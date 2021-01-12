package wutian.sunmodel.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Map;

@Data
@AllArgsConstructor
public class ChinaSunRadiation {
    private String code;
    private ArrayList<Double> coordinates;
    private Map<String, String> data;

    public Double getData(Date date) {
        return Double.parseDouble(this.data.get(date));
    }
}
