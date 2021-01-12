package wutian.sunmodel.dao;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.ChinaSSD1017;

import java.util.List;

@Repository
public class ChinaSSD1017Dao {
    @Autowired
    MongoTemplate mongoTemplate;
    public List<ChinaSSD1017> findAll(String collectionName) {
        return mongoTemplate.find(new Query(),ChinaSSD1017.class,collectionName);
    }

    public List<ChinaSSD1017> findByCode(String collectionName,String code) {
        Query query = new Query();
        query.addCriteria(Criteria.where("code").is(code));
        return mongoTemplate.find(query,ChinaSSD1017.class,collectionName);
    }

    public List<ChinaSSD1017> findInPolygon(String collectionName, GeoJsonPolygon geoJsonPolygon) {
        Query query = new Query();
        query.addCriteria(Criteria.where("coordinates").within(geoJsonPolygon));
        return mongoTemplate.find(query,ChinaSSD1017.class,collectionName);
    }
}
