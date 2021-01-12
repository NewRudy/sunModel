package wutian.sunmodel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import wutian.sunmodel.dao.ChinaCodeDao;
import wutian.sunmodel.entity.ChinaCode;

@RestController
@RequestMapping(value = "chinacode")
public class ChinaCodeController {
    @Autowired
    ChinaCodeDao chinaCodeDao;

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public String get(@PathVariable("name") String name) {
        ChinaCode chinaCode = chinaCodeDao.findByName("ChinaDistrictCode", name);
        return chinaCode.getCode();
    }
}
