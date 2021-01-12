package wutian.sunmodel.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import wutian.sunmodel.entity.ModelItem;

import java.util.List;

@Repository
public class ModelItemDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<ModelItem> findAll(String collectionName) {
        return mongoTemplate.find(new Query(), ModelItem.class, collectionName);
    }

    public List<ModelItem> findByName(String collectionName, String name) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        return mongoTemplate.find(query,ModelItem.class,collectionName);
    }
}
