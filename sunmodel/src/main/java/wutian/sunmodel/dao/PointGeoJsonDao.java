package wutian.sunmodel.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.PointGeoJson;

import java.util.List;

@Repository
public class PointGeoJsonDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<PointGeoJson> findPointInPolygon(GeoJsonPolygon geoJsonPolygon, String collectionName){
        Query query = new Query(Criteria.where("location").within(geoJsonPolygon));
        List<PointGeoJson> list = mongoTemplate.find(query, PointGeoJson.class, collectionName);
        return  list;
    }

    public void insert(PointGeoJson pointGeoJson, String collectionName) {
        mongoTemplate.insert(pointGeoJson, collectionName);
    }

    public List<PointGeoJson> findAll(String collectionName) {
        Query query = new Query();
        List<PointGeoJson> list = mongoTemplate.find(query, PointGeoJson.class, collectionName);
        return list;
    }
}
