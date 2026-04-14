package config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import jakarta.annotation.PostConstruct;
import java.util.logging.Logger;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"controller", "service", "dao"})
public class AppConfig {
    private static final Logger logger = Logger.getLogger(AppConfig.class.getName());

    @PostConstruct
    public void init() {
        logger.info("========== AppConfig inicializado com sucesso! ==========");
        System.out.println("========== AppConfig inicializado! ==========");
    }
}