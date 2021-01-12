package wutian.sunmodel.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.ChinaStation;
import wutian.sunmodel.entity.ChinaSunRadiation;

import java.util.List;

@Repository
public class ChinaStationDao {
    @Autowired
    MongoTemplate mongoTemplate;

    public List<ChinaStation> findAll(String collectionName) {
        return mongoTemplate.find(new Query(),ChinaStation.class,collectionName);
    }

    public ChinaStation findByCode(String collectionName, String code) {      //为了突击检查写的
        Query query = new Query();
        query.addCriteria(Criteria.where("code").is(code));
        return mongoTemplate.findOne(query,ChinaStation.class,collectionName);
    }

    public List<ChinaStation> findPointInPolygon(String collectionName, GeoJsonPolygon geoJsonPolygon) {
        Query query = new Query(Criteria.where("coordinates").within(geoJsonPolygon));
        List<ChinaStation> list = mongoTemplate.find(query, ChinaStation.class, collectionName);
        return list;
    }
}
