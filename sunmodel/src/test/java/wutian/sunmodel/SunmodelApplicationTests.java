package wutian.sunmodel;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.geo.GeoJson;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.client.RestTemplate;
import wutian.sunmodel.controller.*;
import wutian.sunmodel.dao.ChinaCodeDao;
import wutian.sunmodel.dao.ChinaSunRadiationDao;
import wutian.sunmodel.dao.PointGeoJsonDao;
import wutian.sunmodel.dao.PolygonGeoJsonDao;
import wutian.sunmodel.entity.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
class MongodbApplicationTests {


    // @Test
    // void contextLoads() {
    //     Book book = new Book();
    //     book.setId(99);
    //     book.setName("buzhidao");
    //     book.setAuthor("曹雪芹");
    //     bookDao.insert(book);
    // }

    // @Test
    // public void test1(){
    //     List<Book> list = bookDao.findAll();
    //     System.out.println(list);
    // }
    @Autowired
    PointGeoJsonDao pointGeoJsonDao;

    @Test
    public void allPoints() {
        List<PointGeoJson> points = pointGeoJsonDao.findAll("weatherStations");
        System.out.println(points.get(0).getGeometry());
    }

    @Test
    public void angstrom() {
        double s = 5;
        double a = 0.25;
        double b = 0.5;
        for(int i=0;i<365;++i){
            Angstrom angstrom = new Angstrom(i, 39.48);
            System.out.println(i);
            System.out.print(angstrom.toString());
            System.out.print("res:");
            System.out.print((a+b*s/angstrom.getS_0())*angstrom.getH_0());
            System.out.println("res");
            System.out.println();
        }
    }

    @Autowired
    PolygonGeoJsonDao polygonGeoJsonDao;

    @Test
    public void allPolygons() {
        List<PolygonGeoJson> polygons = polygonGeoJsonDao.findAll("China");
        System.out.println(polygons.get(0).getGeometry());
    }

    @Autowired
    PolygonController polygonController;

    @Test
    public void polygonsByName() {
        List<PolygonGeoJson> polygons = polygonGeoJsonDao.findByName("China", "南京");

        JSONObject jsonObject = new JSONObject();
        JSONArray res = new JSONArray();
        for (int i=0; i<polygons.size();++i) {
            JSONObject temp = new JSONObject();
            temp.put("type", "Feature");
            JSONObject temp2 = new JSONObject();
            temp2.put("type","Polygon");
            temp.put("coordinates", polygons.get(i).getGeometry().getCoordinates());
            temp.put("geometry", temp2);
            res.add(temp);
        }
        jsonObject.put("type", "FeatureCollection");
        jsonObject.put("features", res);
        System.out.println(jsonObject.toJSONString());
        System.out.println(jsonObject);
    }

    @Autowired
    ChinaCodeDao chinaCodeDao;

    @Test
    public void getByName () {
        ChinaCode res = chinaCodeDao.findByName("ChinaDistrictCode","辽宁省");
        System.out.println(res.getCode() instanceof String);
    }

    @Autowired
    ChinaCodeController chinaCodeController;

    @Test
    public void testCodeController () {
        String chinaCode = chinaCodeController.get("辽宁省");
        System.out.println(chinaCode);
    }

    @Autowired
    ChinaSunRadiationDao chinaSunRadiationDao;

    @Test
    public void testChinaSunRadiation() {
        List<ChinaSunRadiation> list = chinaSunRadiationDao.findAll("ChinaSunRadiation");
        System.out.println(list);
    }

    @Test
    public void webTest() {
        String requestUrl = "https://geo.datav.aliyun.com/areas_v2/bound/" + String.valueOf(100000) + ".json";
        RestTemplate restTemplate = new RestTemplate();
        JSONObject geoJson = restTemplate.getForObject(requestUrl, JSONObject.class);
        System.out.println(geoJson);
    }

    @Autowired
    ChinaSunRadiationController chinaSunRadiationController;

    @Test
    public void testSunRadiation() {
        chinaSunRadiationController.sunRadiationData(String.valueOf(320000));

    }

    @Autowired
    ChinaStationController chinaStationController;

    @Test
    public void testChinaStation() {
        chinaStationController.sunRadiationInPolygon(String.valueOf(320000));
    }

    @Autowired
    ChinaSSD1017Controller chinaSSD1017Controller;

    @Test
    public void testSSD() {
        chinaSSD1017Controller.getByLocation(String.valueOf(320000));
    }


}
