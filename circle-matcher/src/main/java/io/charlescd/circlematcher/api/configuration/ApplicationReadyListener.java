package io.charlescd.circlematcher.api.configuration;

import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.Segmentation;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ApplicationReadyListener implements ApplicationListener<ApplicationReadyEvent> {
    private KeyMetadataRepository keyMetadataRepository;
    private SegmentationRepository segmentationRepository;
    public ApplicationReadyListener(KeyMetadataRepository keyMetadataRepository,
                                    SegmentationRepository segmentationRepository
    ){
        this.keyMetadataRepository = keyMetadataRepository;
        this.segmentationRepository = segmentationRepository;
    }
    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        var oldMetaData = this.keyMetadataRepository.findAllOldMetadata();
        oldMetaData.forEach(
                this::updateOldMetadata
        );
    }

    private void updateOldMetadata(KeyMetadata keyMetadata) {
        if (!keyMetadata.getIsDefault()) {
            this.removeMetadata(keyMetadata);
            keyMetadata.setActive(true);
            this.keyMetadataRepository.create(keyMetadata);
            this.createSegmentation(keyMetadata);
        }
    }

    private void createSegmentation(KeyMetadata keyMetadata) {
        var optionalSegmentation = this.segmentationRepository.findByKey(keyMetadata.getKey());
        if (optionalSegmentation.isPresent()) {
            var segmentation = optionalSegmentation.get();
            segmentation.setActive(true);
            if (SegmentationType.SIMPLE_KV.equals(segmentation.getType())) {
                this.segmentationRepository.create(keyMetadata.getKey(), getSegmentationValue(segmentation));
            } else {
                this.segmentationRepository.create(keyMetadata.getKey(), segmentation);
            }
        }
    }

    private Object getSegmentationValue(Segmentation segmentation) {
        return segmentation
                .getNode()
                .getContent()
                .getValue()
                .get(0);
    }

    private void removeMetadata(KeyMetadata keyMetadata) {
        try {
            this.segmentationRepository.removeByKey(keyMetadata.getKey());
            this.keyMetadataRepository.remove(keyMetadata);
        } catch(Exception exception){
            System.out.println(exception.getMessage());
        }
    }
}
