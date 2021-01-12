package wutian.sunmodel.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModelItem {
    private String id;
    private String name;
    private String description;
    private String detail;
    private String author;
    private String classifications;
}
