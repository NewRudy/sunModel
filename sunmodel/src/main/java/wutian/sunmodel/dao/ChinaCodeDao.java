package wutian.sunmodel.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.ChinaCode;

import java.util.regex.Pattern;

@Repository
public class ChinaCodeDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    public ChinaCode findByName(String collectionName, String name) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        return mongoTemplate.findOne(query, ChinaCode.class,collectionName);
    }
}
