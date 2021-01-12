package wutian.sunmodel.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.ChinaSunRadiation;

import java.util.List;

@Repository
public class ChinaSunRadiationDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<ChinaSunRadiation> findAll(String collectionName) {
        Query query = new Query();
        List<ChinaSunRadiation> list = mongoTemplate.find(query, ChinaSunRadiation.class, collectionName);
        return list;
    }

    public List<ChinaSunRadiation> findPointInPolygon(String collectionName, GeoJsonPolygon geoJsonPolygon) {
        Query query = new Query(Criteria.where("coordinates").within(geoJsonPolygon));
        List<ChinaSunRadiation> list = mongoTemplate.find(query, ChinaSunRadiation.class, collectionName);
        return list;
    }
}
