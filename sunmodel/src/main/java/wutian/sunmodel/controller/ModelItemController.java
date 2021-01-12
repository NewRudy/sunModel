package wutian.sunmodel.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import wutian.sunmodel.dao.ModelItemDao;
import wutian.sunmodel.entity.ModelItem;

import java.util.List;

@RestController
@RequestMapping(value = "modelItem")
public class ModelItemController {
    @Autowired
    ModelItemDao modelItemDao;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public String allItems() {
        List<ModelItem> items = modelItemDao.findAll("modelItem");
        return JSON.toJSONString(items);
    }
    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public String getItemsByName(@PathVariable("name") String name) {
       return JSON.toJSONString(modelItemDao.findByName("modelItem",name));
    }
}
