package taxonomyServices;

import rifGenericLibrary.taxonomyServices.TaxonomyServiceProvider;
import rifGenericLibrary.taxonomyServices.TaxonomyTerm;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;


/*
 * Code Road Map:
 * --------------
 * Code is organised into the following sections.  Wherever possible, 
 * methods are classified based on an order of precedence described in 
 * parentheses (..).  For example, if you're trying to find a method 
 * 'getName(...)' that is both an interface method and an accessor 
 * method, the order tells you it should appear under interface.
 * 
 * Order of 
 * Precedence     Section
 * ==========     ======
 * (1)            Section Constants
 * (2)            Section Properties
 * (3)            Section Construction
 * (7)            Section Accessors and Mutators
 * (6)            Section Errors and Validation
 * (5)            Section Interfaces
 * (4)            Section Override
 *
 */

@Path("/")
public class RIFTaxonomyWebServiceResource {

	// ==========================================
	// Section Constants
	// ==========================================

	// ==========================================
	// Section Properties
	// ==========================================
	private SimpleDateFormat sd;

	private RIFFederatedTaxonomyService taxonomyService;
	private WebServiceResponseUtility webServiceResponseUtility;

	// ==========================================
	// Section Construction
	// ==========================================

	public RIFTaxonomyWebServiceResource() {
		super();
		sd = new SimpleDateFormat("HH:mm:ss:SSS");

		taxonomyService = new RIFFederatedTaxonomyService();
		webServiceResponseUtility = new WebServiceResponseUtility();		
	}

	// ==========================================
	// Section Accessors and Mutators
	// ==========================================
	
	@GET
	@Produces({"application/json"})	
	@Path("/getTaxonomyServiceProviders")
	public Response getTaxonomyServiceProviders(
		@Context HttpServletRequest servletRequest) {

		String result = "";

		try {
			ArrayList<TaxonomyServiceProvider> taxonomyServiceProviders
				= taxonomyService.getTaxonomyServiceProviders();
			ArrayList<TaxonomyServiceProviderProxy> serviceProviderProxies
				= new ArrayList<TaxonomyServiceProviderProxy>();
			for (TaxonomyServiceProvider taxonomyServiceProvider : taxonomyServiceProviders) {
				TaxonomyServiceProviderProxy providerProxy
					= TaxonomyServiceProviderProxy.newInstance();
				providerProxy.setIdentifier(
					taxonomyServiceProvider.getIdentifier());
				providerProxy.setName(taxonomyServiceProvider.getName());
				providerProxy.setDescription(taxonomyServiceProvider.getDescription());
				serviceProviderProxies.add(providerProxy);
			}
			
			webServiceResponseUtility.serialiseArrayResult(
				servletRequest, 
				serviceProviderProxies);
		}
		catch(Exception exception) {
			webServiceResponseUtility.serialiseException(
				servletRequest, 
				exception);
		}

		return webServiceResponseUtility.generateWebServiceResponse(
			servletRequest,
			result);
	}
	
	@GET
	@Produces({"application/json"})	
	@Path("/getRootTerms")
	public Response getRootTerms(
		@Context HttpServletRequest servletRequest,
		@QueryParam("taxonomy_id") String taxonomyServiceID) {

		String result = "";

		try {
			ArrayList<TaxonomyTerm> rootTerms
				= taxonomyService.getRootTerms(taxonomyServiceID);
			result 
				= serialiseTaxonomyTerms(
					servletRequest,
					rootTerms);
		}
		catch(Exception exception) {
			webServiceResponseUtility.serialiseException(
				servletRequest, 
				exception);
		}
		
		return webServiceResponseUtility.generateWebServiceResponse(
			servletRequest,
			result);		
	}
		
	@GET
	@Produces({"application/json"})	
	@Path("/getMatchingTerms")
	public Response getMatchingTerms(
		@Context HttpServletRequest servletRequest,
		@QueryParam("taxonomy_id") String taxonomyServiceID,
		@QueryParam("search_text") String searchText,
		@QueryParam("is_case_sensitive") Boolean isCaseSensitive) {

		String result = "";
		
		try {
			ArrayList<TaxonomyTerm> matchingTerms
				= taxonomyService.getMatchingTerms(
					taxonomyServiceID, 
					searchText, 
					isCaseSensitive);

			result 
				= serialiseTaxonomyTerms(
					servletRequest,
					matchingTerms);
		}
		catch(Exception exception) {
			webServiceResponseUtility.serialiseException(
				servletRequest, 
				exception);
		}
		return webServiceResponseUtility.generateWebServiceResponse(
			servletRequest,
			result);		
	}
	
	@GET
	@Produces({"application/json"})	
	@Path("/getImmediateChildTerms")
	public Response getImmediateChildTerms(
		@Context HttpServletRequest servletRequest,
		@QueryParam("taxonomy_id") String taxonomyServiceID,
		@QueryParam("parent_term_id") String parentTermID) {

		String result = "";

		try {
			ArrayList<TaxonomyTerm> childTerms
				= taxonomyService.getImmediateChildTerms(
					taxonomyServiceID, 
					parentTermID);
			result 
				= serialiseTaxonomyTerms(
					servletRequest,
					childTerms);
		}
		catch(Exception exception) {
			webServiceResponseUtility.serialiseException(
				servletRequest, 
				exception);
		}

		return webServiceResponseUtility.generateWebServiceResponse(
			servletRequest,
			result);		
	}
	
	@GET
	@Produces({"application/json"})	
	@Path("/getParentTerm")
	public Response getParentTerm(
		@Context HttpServletRequest servletRequest,
		@QueryParam("taxonomy_id") String taxonomyServiceID,
		@QueryParam("child_term_id") String childTermID) {
	
		String result = "";

		try {
			TaxonomyTerm parentTerm
				= taxonomyService.getParentTerm(
					taxonomyServiceID, 
					childTermID);
			result = serialiseTaxonomyTerm(
						servletRequest, 
						parentTerm);
		}
		catch(Exception exception) {
			webServiceResponseUtility.serialiseException(servletRequest, 
				exception);
		}
		
		return webServiceResponseUtility.generateWebServiceResponse(
			servletRequest,
			result);		
	}
	
	private String serialiseTaxonomyTerm(
		final HttpServletRequest servletRequest,
		final TaxonomyTerm taxonomyTerm) 
		throws Exception {

		TaxonomyTermProxy termProxy
			= TaxonomyTermProxy.newInstance();
		termProxy.setIdentifier(taxonomyTerm.getIdentifier());
		termProxy.setLabel(taxonomyTerm.getLabel());
		termProxy.setDescription(taxonomyTerm.getDescription());
		return webServiceResponseUtility.serialiseSingleItemAsArrayResult(
			servletRequest, 
			termProxy);
	}
	
	private String serialiseTaxonomyTerms(
		final HttpServletRequest servletRequest,
		final ArrayList<TaxonomyTerm> taxonomyTerms) 
		throws Exception {
		
		ArrayList<TaxonomyTermProxy> termProxies
			= new ArrayList<TaxonomyTermProxy>();
		for (TaxonomyTerm taxonomyTerm : taxonomyTerms) {
			TaxonomyTermProxy termProxy
				= TaxonomyTermProxy.newInstance();
			termProxy.setIdentifier(taxonomyTerm.getIdentifier());
			termProxy.setLabel(taxonomyTerm.getLabel());
			termProxy.setDescription(taxonomyTerm.getDescription());
			termProxies.add(termProxy);
		}
	
		return webServiceResponseUtility.serialiseArrayResult(
			servletRequest, 
			termProxies);			
	}
	
	// ==========================================
	// Section Errors and Validation
	// ==========================================
	// ==========================================
	// Section Interfaces
	// ==========================================

	// ==========================================
	// Section Override
	// ==========================================
}