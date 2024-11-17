import FeatureRequests from "@/components/feature-vote/feature-request-list";
import AddFeatureForm from "@/components/feature-vote/feature-submission-form";

export default function FeatureRequestsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <AddFeatureForm />
            <FeatureRequests />
        </div>
    );
}
