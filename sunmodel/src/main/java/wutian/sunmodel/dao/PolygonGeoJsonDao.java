package wutian.sunmodel.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.PointGeoJson;
import wutian.sunmodel.entity.PolygonGeoJson;

import java.awt.*;
import java.util.List;
import java.util.regex.Pattern;

@Repository
public class PolygonGeoJsonDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<PolygonGeoJson> findAll(String collectionName) {
        Query query = new Query();
        List<PolygonGeoJson> list = mongoTemplate.find(query, PolygonGeoJson.class, collectionName);
        return  list;
    }

    public List<PolygonGeoJson> findByName(String collectionName, String name) {
        Query query = new Query();
        Pattern pattern = Pattern.compile("^.*" + name + ".*$", Pattern.CASE_INSENSITIVE);
        query.addCriteria(Criteria.where("name").regex(pattern));
        List<PolygonGeoJson> list = mongoTemplate.find(query, PolygonGeoJson.class, collectionName);
        return list;
    }
}
