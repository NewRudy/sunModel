package wutian.sunmodel.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import wutian.sunmodel.dao.ChinaStationDao;
import wutian.sunmodel.entity.ChinaStation;
import wutian.sunmodel.entity.ChinaSunRadiation;
import wutian.sunmodel.entity.MultiPolygon;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping(value = "chinaStation")
public class ChinaStationController {
    @Autowired
    ChinaStationDao chinaStationDao;

    @RequestMapping(value = "/all")
    public String getAll(){
        JSONObject jsonObject = new JSONObject();
        List<ChinaStation> res = chinaStationDao.findAll("ChinaStations");
        return JSONObject.toJSONString(res);
    }

    @RequestMapping(value = "/code/{code}")
    public String getByCode(@PathVariable("code") String code){
        return JSONObject.toJSONString(chinaStationDao.findByCode("ChinaStations",code));
    }

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
        List<ChinaStation> list = chinaStationDao.findPointInPolygon("ChinaStations", geoJsonPolygon);
        // 所有点转为geoJson格式
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "FeatureCollection");
        JSONArray jsonArray = new JSONArray();
        for(int i=0;i<list.size();++i) {
            JSONObject temp = new JSONObject();
            temp.put("type","Feature");
            JSONObject temp2 = new JSONObject();
            temp2.put("type","Point");
            temp2.put("coordinates",list.get(i).getCoordinates());
            JSONObject temp3 = new JSONObject();
            temp3.put("name",list.get(i).getName());
            temp3.put("type",list.get(i).getType());
            temp.put("geometry",temp2);
            jsonArray.add(temp);
        }
        jsonObject.put("features",jsonArray);
        return jsonObject.toJSONString();
    }
}
