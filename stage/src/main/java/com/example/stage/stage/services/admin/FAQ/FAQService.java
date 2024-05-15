package com.example.stage.stage.services.admin.FAQ;

import com.example.stage.stage.dto.FAQDto;

public interface FAQService {
    FAQDto postFAQ(Long productId, FAQDto faqDto);
}
