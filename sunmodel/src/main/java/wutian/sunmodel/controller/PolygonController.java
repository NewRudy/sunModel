package wutian.sunmodel.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.org.apache.xerces.internal.xs.StringList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import wutian.sunmodel.dao.PolygonGeoJsonDao;
import wutian.sunmodel.entity.PolygonGeoJson;
import wutian.sunmodel.entity.SingleJson;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "polygons")
public class PolygonController {
    @Autowired
    PolygonGeoJsonDao polygonGeoJsonDao;

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public String get(@PathVariable("name") String name) {
        List<PolygonGeoJson> polygons = polygonGeoJsonDao.findByName("China", name);

        JSONObject jsonObject = new JSONObject();
        JSONArray res = new JSONArray();
        for (int i=0; i<polygons.size();++i) {
            JSONObject temp = new JSONObject();
            temp.put("type", "Feature");
            JSONObject temp2 = new JSONObject();
            temp2.put("type","Polygon");
            temp2.put("coordinates", polygons.get(i).getGeometry().getCoordinates());
            temp.put("geometry", temp2);
            res.add(temp);
        }
        jsonObject.put("type", "FeatureCollection");
        jsonObject.put("features", res);
        System.out.println(jsonObject.toJSONString());
        return jsonObject.toJSONString();
    }

}
