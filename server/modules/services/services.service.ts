import { asc, eq } from 'drizzle-orm';
import { db } from '../../../src/db/index.ts';
import { faqs, services } from '../../../src/db/schema.ts';
import { FAQ_CATALOG, SERVICE_CATALOG } from '../../../src/data/catalog.ts';

let catalogSeeded = false;
let seedingInFlight: Promise<void> | null = null;

export async function ensureCatalogSeeded(): Promise<void> {
  if (catalogSeeded) return;
  if (seedingInFlight) return seedingInFlight;

  seedingInFlight = (async () => {
    try {
      const existingServices = await db
        .select({ id: services.id })
        .from(services)
        .limit(1);

      if (existingServices.length === 0) {
        for (const item of SERVICE_CATALOG) {
          await db
            .insert(services)
            .values({
              slug: item.slug,
              title: item.title,
              shortDescription: item.shortDescription,
              fullDescription: item.fullDescription,
              subcategories: item.subcategories,
              audience: item.audience,
              howWeHelp: item.howWeHelp,
              disclaimer: item.disclaimer,
              sortOrder: item.sortOrder,
              isPublished: true,
            })
            .onConflictDoNothing({ target: services.slug });
        }
      }

      const existingFaqs = await db
        .select({ id: faqs.id })
        .from(faqs)
        .limit(1);

      if (existingFaqs.length === 0) {
        await db.insert(faqs).values(
          FAQ_CATALOG.map((faq) => ({
            serviceSlug: faq.serviceSlug,
            category: faq.category,
            question: faq.question,
            answer: faq.answer,
            sortOrder: faq.sortOrder,
            isPublished: true,
          })),
        );
      }

      catalogSeeded = true;
    } catch (error) {
      console.error('Catalog seed error:', error);
      throw new Error('Failed to initialize service catalog.', { cause: error });
    } finally {
      seedingInFlight = null;
    }
  })();

  return seedingInFlight;
}

export async function listPublishedServices() {
  await ensureCatalogSeeded();
  try {
    return await db
      .select()
      .from(services)
      .where(eq(services.isPublished, true))
      .orderBy(asc(services.sortOrder));
  } catch (error) {
    console.error('Failed to list services:', error);
    throw new Error('Failed to load services.', { cause: error });
  }
}

export async function getPublishedServiceBySlug(slug: string) {
  await ensureCatalogSeeded();
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);

    const svc = rows[0];
    if (!svc || !svc.isPublished) {
      return null;
    }

    const serviceFaqs = await db
      .select()
      .from(faqs)
      .where(eq(faqs.serviceSlug, slug))
      .orderBy(asc(faqs.sortOrder));

    return {
      ...svc,
      faqs: serviceFaqs.filter((f) => f.isPublished),
    };
  } catch (error) {
    console.error('Failed to get service detail:', error);
    throw new Error('Failed to load service details.', { cause: error });
  }
}

export async function listPublishedFaqs(serviceSlug?: string) {
  await ensureCatalogSeeded();
  try {
    const all = await db
      .select()
      .from(faqs)
      .where(eq(faqs.isPublished, true))
      .orderBy(asc(faqs.sortOrder));

    if (!serviceSlug || serviceSlug === 'all') {
      return all;
    }
    return all.filter((f) => f.serviceSlug === serviceSlug);
  } catch (error) {
    console.error('Failed to list FAQs:', error);
    throw new Error('Failed to load FAQs.', { cause: error });
  }
}

export async function listAllServicesAdmin() {
  await ensureCatalogSeeded();
  try {
    return await db.select().from(services).orderBy(asc(services.sortOrder));
  } catch (error) {
    console.error('Admin failed to list services:', error);
    throw new Error('Failed to load services.', { cause: error });
  }
}

export async function updateServiceAdmin(
  slug: string,
  patch: {
    shortDescription?: string;
    fullDescription?: string;
    disclaimer?: string;
    isPublished?: boolean;
  },
) {
  await ensureCatalogSeeded();
  try {
    const updated = await db
      .update(services)
      .set({
        ...(patch.shortDescription !== undefined
          ? { shortDescription: patch.shortDescription }
          : {}),
        ...(patch.fullDescription !== undefined
          ? { fullDescription: patch.fullDescription }
          : {}),
        ...(patch.disclaimer !== undefined ? { disclaimer: patch.disclaimer } : {}),
        ...(patch.isPublished !== undefined
          ? { isPublished: patch.isPublished }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(services.slug, slug))
      .returning();

    return updated[0] || null;
  } catch (error) {
    console.error('Failed to update service:', error);
    throw new Error('Failed to update service.', { cause: error });
  }
}

export async function listAllFaqsAdmin() {
  await ensureCatalogSeeded();
  try {
    return await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  } catch (error) {
    console.error('Admin failed to list FAQs:', error);
    throw new Error('Failed to load FAQs.', { cause: error });
  }
}

export async function createFaqAdmin(input: {
  serviceSlug: string;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isPublished?: boolean;
}) {
  await ensureCatalogSeeded();
  try {
    const created = await db
      .insert(faqs)
      .values({
        serviceSlug: input.serviceSlug,
        category: input.category,
        question: input.question,
        answer: input.answer,
        sortOrder: input.sortOrder ?? 99,
        isPublished: input.isPublished ?? true,
      })
      .returning();
    return created[0];
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    throw new Error('Failed to create FAQ.', { cause: error });
  }
}

export async function updateFaqAdmin(
  id: number,
  input: {
    category?: string;
    question?: string;
    answer?: string;
    isPublished?: boolean;
  },
) {
  try {
    const updated = await db
      .update(faqs)
      .set({
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.question !== undefined ? { question: input.question } : {}),
        ...(input.answer !== undefined ? { answer: input.answer } : {}),
        ...(input.isPublished !== undefined
          ? { isPublished: input.isPublished }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(faqs.id, id))
      .returning();
    return updated[0] || null;
  } catch (error) {
    console.error('Failed to update FAQ:', error);
    throw new Error('Failed to update FAQ.', { cause: error });
  }
}

export async function deleteFaqAdmin(id: number) {
  try {
    const deleted = await db
      .delete(faqs)
      .where(eq(faqs.id, id))
      .returning();
    return deleted[0] || null;
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
    throw new Error('Failed to delete FAQ.', { cause: error });
  }
}
