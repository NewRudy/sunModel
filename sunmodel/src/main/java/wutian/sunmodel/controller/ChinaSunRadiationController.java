package wutian.sunmodel.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJson;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import wutian.sunmodel.dao.ChinaSunRadiationDao;
import wutian.sunmodel.entity.ChinaSunRadiation;
import wutian.sunmodel.entity.MultiPolygon;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping(value = "sunRadiation")
public class ChinaSunRadiationController {
    @Autowired
    ChinaSunRadiationDao chinaSunRadiationDao;

    // @RequestMapping(value = "/all", method = RequestMethod.GET) // 数据量太大，不建议这么传送
    // public String allSunRadiation() {
    //     List<ChinaSunRadiation> list = chinaSunRadiationDao.findAll("ChinaSunRadiation");
    //
    // }

    @RequestMapping(value = "/location/{code}", method = RequestMethod.GET)
    public String sunRadiationInPolygon(@PathVariable ("code") String code) {       // 根据边界找点，数据库需要重构
        // 从api拿到对应的边界
        String requestUrl = "https://geo.datav.aliyun.com/areas_v2/bound/" + code + ".json";
        RestTemplate restTemplate = new RestTemplate();
        JSONObject json = restTemplate.getForObject(requestUrl, JSONObject.class);
        ArrayList list1 = (ArrayList) json.get("features");
        LinkedHashMap test = (LinkedHashMap)list1.get(0);
        LinkedHashMap geometry = (LinkedHashMap)test.get("geometry");
        String jsonStr = JSON.toJSONString(geometry);
        // // JSONObject tempJson = JSON.parseObject(jsonStr);
        // // Object geometry = tempJson.get("geometry");
        // // System.out.println(geometry.getClass());
        // Pattern p = Pattern.compile("(geometry).*?((?=\\})(?=\\])(?=\\}))");
        // Matcher m = p.matcher(jsonStr);
        // if (m.find()){
        //     jsonStr = m.group(0);
        // } else {
        //     System.out.println("no geoJson");
        //     return "";
        // }
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
        List<ChinaSunRadiation> list = chinaSunRadiationDao.findPointInPolygon("ChinaSunRadiation", geoJsonPolygon);
        // 所有点转为geoJson格式
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "FeatureCollection");
        JSONArray  jsonArray = new JSONArray();
        for(int i=0;i<list.size();++i) {
            JSONObject temp = new JSONObject();
            temp.put("type","Feature");
            // JSONObject temp1 = new JSONObject();         // 传data加载不了
            // temp1.put("data",list.get(i).getData());
            // temp.put("properties",temp1);
            JSONObject temp2 = new JSONObject();
            temp2.put("type","Point");
            temp2.put("coordinates",list.get(i).getCoordinates());
            temp.put("geometry",temp2);
            jsonArray.add(temp);
        }
        jsonObject.put("features",jsonArray);
        return jsonObject.toJSONString();
    }

    @RequestMapping(value = "/bound/{code}", method = RequestMethod.GET)
    public String sunRadiationBound(@PathVariable("code") String code) {       //返回code的边界
        String requestUrl = "https://geo.datav.aliyun.com/areas_v2/bound/" + code + ".json";
        RestTemplate restTemplate = new RestTemplate();
        JSONObject json = restTemplate.getForObject(requestUrl, JSONObject.class);
        ArrayList list1 = (ArrayList) json.get("features");
        LinkedHashMap test = (LinkedHashMap)list1.get(0);
        LinkedHashMap geometry = (LinkedHashMap)test.get("geometry");
        String string = JSON.toJSONString(geometry);
        return string;
    }

    @RequestMapping(value = "/data/{code}", method = RequestMethod.GET)
    public String sunRadiationData(@PathVariable("code") String code) {
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
        List<ChinaSunRadiation> list = chinaSunRadiationDao.findPointInPolygon("ChinaSunRadiation", geoJsonPolygon);
        String string = JSON.toJSONString(list);
        return string;
    }
}
