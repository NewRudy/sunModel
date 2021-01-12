package wutian.sunmodel.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
public class SingleJson {
    private String type;
    private String coordinates;

    public List<List<Double>> getCoordinates() {
        List<String> temp = Arrays.asList(this.coordinates.split(","));
        List<List<Double>> res = new ArrayList<>();
        for(int i=0;i<temp.size();) {
            List<Double> coordinate = new ArrayList<>();
            coordinate.add(Double.parseDouble(temp.get(i)));
            coordinate.add(Double.parseDouble(temp.get(i+1)));
            res.add(coordinate);
            i += 2;
        }
        return res;
    }
}
