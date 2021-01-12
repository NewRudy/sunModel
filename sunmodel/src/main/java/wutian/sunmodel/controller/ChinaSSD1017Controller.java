package wutian.sunmodel.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import wutian.sunmodel.dao.ChinaSSD1017Dao;
import wutian.sunmodel.entity.ChinaSSD1017;
import wutian.sunmodel.entity.MultiPolygon;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/ssd")
public class ChinaSSD1017Controller {
    @Autowired
    ChinaSSD1017Dao chinaSSD1017Dao;

    @RequestMapping(value = "/code/{code}")
    public String getByCode(@PathVariable("code") String code){
        List<ChinaSSD1017> list = chinaSSD1017Dao.findByCode("test",code);
        return JSON.toJSONString(list);
    }

    @RequestMapping(value = "/location/{code}")
    public String getByLocation(@PathVariable("code") String code) {
        // 从api拿到对应的边界
        String requestUrl = "https://geo.datav.aliyun.com/areas_v2/bound/" + code + ".json";
        RestTemplate restTemplate = new RestTemplate();
        JSONObject json = restTemplate.getForObject(requestUrl, JSONObject.class);
        ArrayList list1 = (ArrayList) json.get("features");
        LinkedHashMap test = (LinkedHashMap)list1.get(0);
        LinkedHashMap geometry = (LinkedHashMap)test.get("geometry");
        String jsonStr = JSON.toJSONString(geometry);
        MultiPolygon geoPolygon = JSONObject.parseObject(jsonStr, MultiPolygon.class);
        List<Point> points = new ArrayList<>();
        List<List<List<List<Double>>>> coordinates = geoPolygon.getCoordinates();
        List<List<List<Double>>> coordinate = coordinates.get(0);
        for(List<List<Double>> temp: coordinate){
            for (List<Double> doubles : temp) {
                Point point = new Point(doubles.get(0), doubles.get(1));
                points.add(point);
            }
        }
        GeoJsonPolygon geoJsonPolygon = new GeoJsonPolygon(points);
        List<ChinaSSD1017> list = chinaSSD1017Dao.findInPolygon("test",geoJsonPolygon);
        return JSON.toJSONString(list);
    }
}
