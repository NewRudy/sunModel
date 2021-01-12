package wutian.sunmodel.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {
    @RequestMapping(value = "/index")
    public String defaultPath() {
        return "index";
    }

    @RequestMapping(value = "/model")
    public String model(){
        return "model";
    }
}
