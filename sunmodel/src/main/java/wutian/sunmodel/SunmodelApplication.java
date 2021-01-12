package wutian.sunmodel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class SunmodelApplication {

    public static void main(String[] args) {
        SpringApplication.run(SunmodelApplication.class, args);
    }

}
