package wutian.sunmodel.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import wutian.sunmodel.dao.PointGeoJsonDao;
import wutian.sunmodel.entity.PointGeoJson;
import wutian.sunmodel.entity.SingleJson;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "points")
public class PointController {
    @Autowired
    PointGeoJsonDao pointGeoJsonDao;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public String allPoints() {
        List<PointGeoJson> points = pointGeoJsonDao.findAll("weatherStations");
        JSONObject jsonObject = new JSONObject();
        List<String> res = new ArrayList<String>();
        for(int i=0;i < points.size(); ++i){
            res.add(JSON.toJSONString(points.get(i).getGeometry()));
        }
        jsonObject.put("type", "GeometryCollection");
        jsonObject.put("geometries", res);
        return jsonObject.toJSONString();
    }
}
