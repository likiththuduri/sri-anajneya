package com.srianjaneya.store;

import com.srianjaneya.store.entity.Admin;
import com.srianjaneya.store.entity.Category;
import com.srianjaneya.store.entity.Product;
import com.srianjaneya.store.entity.ShopSetting;
import com.srianjaneya.store.repository.AdminRepository;
import com.srianjaneya.store.repository.CategoryRepository;
import com.srianjaneya.store.repository.ProductRepository;
import com.srianjaneya.store.repository.ShopSettingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.math.BigDecimal;
import java.nio.file.Paths;

@SpringBootApplication
public class SriAnjaneyaStoreApplication implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(SriAnjaneyaStoreApplication.class);

    @Value("${upload.local-dir:./uploads}")
    private String localUploadDir;

    public static void main(String[] args) {
        SpringApplication.run(SriAnjaneyaStoreApplication.class, args);
        log.info("==========================================================================");
        log.info("SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS Backend API Started Successfully!");
        log.info("==========================================================================");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get(localUploadDir).toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath)
                .setCachePeriod(3600);
    }

    /**
     * Bootstrap default administrator, core settings, categories, and inventory if not present
     */
    @Bean
    public ApplicationRunner bootstrapData(
            AdminRepository adminRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            ShopSettingRepository shopSettingRepository,
            PasswordEncoder passwordEncoder,
            @Value("${admin.default.username:admin}") String defaultAdminUser,
            @Value("${admin.default.password:adminPassword123!}") String defaultAdminPass,
            @Value("${shop.name:SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS}") String defaultShopName,
            @Value("${shop.whatsapp:917095891270}") String defaultShopWhatsApp,
            @Value("${shop.phone:917095891270}") String defaultShopPhone) {

        return args -> {
            // 1. Ensure Admin Account
            if (!adminRepository.existsByUsernameIgnoreCase(defaultAdminUser)) {
                log.info("Bootstrapping default admin account '{}'...", defaultAdminUser);
                Admin admin = new Admin(
                        defaultAdminUser,
                        passwordEncoder.encode(defaultAdminPass),
                        "Shop Administrator",
                        "ROLE_ADMIN"
                );
                adminRepository.save(admin);
                log.info("Default admin account created successfully.");
            }

            // 2. Ensure Shop Settings
            if (shopSettingRepository.count() == 0) {
                ShopSetting setting = new ShopSetting();
                setting.setId(1L);
                setting.setShopName(defaultShopName);
                setting.setPhone(defaultShopPhone);
                setting.setWhatsapp(defaultShopWhatsApp);
                setting.setAddress("Main Road, Near Rythu Bharosa Kendram, Telangana - 508213, India");
                setting.setState("Telangana");
                shopSettingRepository.save(setting);
                log.info("Default shop settings initialized.");
            }

            // 3. Ensure Default Categories
            Category fertilizers = categoryRepository.findBySlugIgnoreCase("fertilizers")
                    .orElseGet(() -> categoryRepository.save(new Category("Fertilizers", "fertilizers", "Primary macronutrients, NPK, DAP, Urea", 1, true)));

            Category pesticides = categoryRepository.findBySlugIgnoreCase("pesticides")
                    .orElseGet(() -> categoryRepository.save(new Category("Pesticides", "pesticides", "Insecticides, Fungicides, Weedicides", 2, true)));

            Category seeds = categoryRepository.findBySlugIgnoreCase("seeds")
                    .orElseGet(() -> categoryRepository.save(new Category("Seeds", "seeds", "Certified high-yielding hybrid seeds", 3, true)));

            Category micronutrients = categoryRepository.findBySlugIgnoreCase("micronutrients")
                    .orElseGet(() -> categoryRepository.save(new Category("Micronutrients", "micronutrients", "Zinc, Boron, Chelated nutrients", 4, true)));

            // 4. Ensure Initial Inventory Products
            if (productRepository.count() == 0) {
                log.info("Bootstrapping initial agricultural products catalog...");

                // Fertilizers
                productRepository.save(new Product(
                        "Gromor DAP 18:46:0 Fertilizer", "Coromandel International", fertilizers,
                        "High-grade phosphatic fertilizer providing 18% Ammoniacal Nitrogen and 46% Phosphorus. Promotes strong root establishment.",
                        new BigDecimal("1350.00"), "50 kg Bag", 120,
                        "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "IFFCO Neem Coated Urea", "IFFCO", fertilizers,
                        "Contains 46% Nitrogen coated with pure neem oil to slow nitrogen release and enhance nutrient uptake.",
                        new BigDecimal("266.50"), "45 kg Bag", 250,
                        "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "Gromor 20:20:0:13 Ammonium Phosphate Sulphate", "Coromandel International", fertilizers,
                        "Balanced granular fertilizer with Nitrogen, Phosphate, and Sulphur. Ideal for oilseeds, pulses, cotton, and paddy.",
                        new BigDecimal("1400.00"), "50 kg Bag", 90,
                        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80", true, false
                ));

                productRepository.save(new Product(
                        "Muriate of Potash (MOP) 60% K2O", "Indian Potash Limited (IPL)", fertilizers,
                        "Essential potassium fertilizer improving grain filling, disease resistance, drought tolerance, and harvest quality.",
                        new BigDecimal("1700.00"), "50 kg Bag", 65,
                        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80", true, false
                ));

                // Pesticides
                productRepository.save(new Product(
                        "Coragen Insecticide (Chlorantraniliprole 18.5% SC)", "FMC India", pesticides,
                        "Industry benchmark broad-spectrum insecticide for control of stem borers, leaf folders, bollworms, and spodoptera in rice, sugarcane, and cotton.",
                        new BigDecimal("1850.00"), "150 ml", 45,
                        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "Regent 5% SC (Fipronil)", "Bayer CropScience", pesticides,
                        "Broad-spectrum phenylpyrazole insecticide providing excellent systemic control against sucking pests, root grubs, and stem borers.",
                        new BigDecimal("820.00"), "500 ml", 35,
                        "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80", true, false
                ));

                productRepository.save(new Product(
                        "Amistar Top (Azoxystrobin + Difenoconazole)", "Syngenta", pesticides,
                        "Dual active broad-spectrum systemic fungicide offering preventive and curative defense against blast, sheath blight, and leaf spots.",
                        new BigDecimal("1650.00"), "200 ml", 30,
                        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "Confidor 17.8% SL (Imidacloprid)", "Bayer CropScience", pesticides,
                        "Premier systemic insecticide for long-lasting protection against aphids, jassids, thrips, and whiteflies in chilli and cotton.",
                        new BigDecimal("480.00"), "100 ml", 50,
                        "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80", true, false
                ));

                // Seeds
                productRepository.save(new Product(
                        "Rasi 659 BG II Cotton Seeds", "Rasi Seeds", seeds,
                        "High-yielding Bollgard II hybrid cotton seeds with big boll size, superior fiber quality, and excellent sucking pest tolerance for Telangana soils.",
                        new BigDecimal("864.00"), "475 g Packet", 80,
                        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "US 312 Hybrid Paddy Seeds", "Bayer CropScience", seeds,
                        "Fine grain, high-tillering hybrid paddy seeds with exceptional grain recovery and bacterial blight tolerance. Suitable for Kharif & Rabi.",
                        new BigDecimal("1050.00"), "3 kg Pack", 60,
                        "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "Kaveri Chintoo F1 Hybrid Chilli Seeds", "Kaveri Seed Company", seeds,
                        "Vigorous erect plant type bearing pungent, attractive dark red dry chillies. Highly preferred by Khammam & Warangal chilli growers.",
                        new BigDecimal("1450.00"), "10 g Pouch", 40,
                        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80", true, false
                ));

                productRepository.save(new Product(
                        "Pioneer 3396 Hybrid Maize Seeds", "Corteva Agriscience", seeds,
                        "High yielding yellow flint hybrid maize seeds with strong lodging resistance and heavy kernel weight.",
                        new BigDecimal("2200.00"), "4 kg Bag", 50,
                        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80", true, false
                ));

                // Micronutrients
                productRepository.save(new Product(
                        "Multiplex Kranti Complete Micronutrient Fertilizer", "Multiplex Group", micronutrients,
                        "Multi-micronutrient liquid formulation containing Zinc, Iron, Manganese, Copper, Boron, and Molybdenum in balanced proportions for foliar spray.",
                        new BigDecimal("650.00"), "1 Litre Bottle", 40,
                        "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80", true, true
                ));

                productRepository.save(new Product(
                        "Coromandel Zinc Sulfate Heptahydrate 21% Zn", "Coromandel International", micronutrients,
                        "Essential zinc fertilizer correcting Khaira disease in paddy and pale leaves in maize and pulses.",
                        new BigDecimal("420.00"), "5 kg Bag", 75,
                        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80", true, false
                ));

                productRepository.save(new Product(
                        "Aries Chelamin Gold (Chelated Zinc 12% EDTA)", "Aries Agro Limited", micronutrients,
                        "100% water-soluble EDTA chelated zinc ensuring quick absorption by crop leaves without chemical fixation.",
                        new BigDecimal("320.00"), "250 g Box", 55,
                        "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80", true, false
                ));

                productRepository.save(new Product(
                        "Aries Boron 20% Disodium Octaborate Tetrahydrate", "Aries Agro Limited", micronutrients,
                        "Foliar spray and fertigation boron aiding pollen germination, fruit set, and sugar translocation in cotton, chilli, and vegetables.",
                        new BigDecimal("290.00"), "250 g Pack", 60,
                        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80", true, false
                ));

                log.info("Catalog initialized with 16 genuine agricultural products.");
            }
        };
    }
}
