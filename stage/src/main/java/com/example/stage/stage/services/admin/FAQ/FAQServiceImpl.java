package com.example.stage.stage.services.admin.FAQ;

import com.example.stage.stage.dto.FAQDto;
import com.example.stage.stage.entity.FAQ;
import com.example.stage.stage.entity.Product;
import com.example.stage.stage.repostory.FAQRepository;
import com.example.stage.stage.repostory.ProcuctRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FAQServiceImpl implements FAQService {
    private final FAQRepository faqRepository;

    private final ProcuctRepository productRepository;
    public FAQDto postFAQ(Long productId, FAQDto faqDto) {
        Optional<Product> optionalProduct =productRepository.findById(productId);
        if (optionalProduct.isPresent()){
            FAQ faq= new FAQ();

            faq.setQuestion(faqDto.getQuestion());
            faq.setAnswer (faqDto.getAnswer());
            faq.setProduct(optionalProduct.get());
            return faqRepository.save(faq).getFAQDto();
        }
        return null;
    }
}
